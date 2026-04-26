// SPDX-License-Identifier: GPL-2.0-only
'use strict';
'require view';
'require rpc';

var callGetStatus = rpc.declare({
	object: 'luci.cellstatus',
	method: 'get_status'
});

function renderRow(label, value) {
	return E('div', { 'class': 'tr' }, [
		E('div', { 'class': 'td left', 'width': '50%' }, [ label ]),
		E('div', { 'class': 'td left' }, [ (value != null) ? String(value) : _('N/A') ])
	]);
}

function renderBar(value, min, max, unit) {
	var num = Number(value);
	if (isNaN(num)) num = min;
	num = Math.min(Math.max(num, min), max);
	var pct = ((num - min) / (max - min) * 100).toFixed(0);
	return E('div', {}, [
		E('div', { 'class': 'cbi-progressbar', 'title': num + unit }, [
			E('div', { 'style': 'width:' + pct + '%' }, [])
		]),
		E('small', {}, [ min + unit + ' \u2026 ' + max + unit ])
	]);
}

return view.extend({
	load: function() {
		return L.resolveDefault(callGetStatus(), { modem_present: false });
	},

	render: function(status) {
		var node = E('div', {});
		node.appendChild(E('h2', {}, [ _('Cellular Network Information and Status') ]));

		if (!status || !status.modem_present) {
			node.appendChild(E('div', { 'class': 'cbi-section' }, [
				E('p', {}, [ _('There seems to be no cellular modem installed.') ]),
				E('p', {}, [
					E('small', {}, [
						_('Debug — raw RPC response: '),
						E('code', {}, [ JSON.stringify(status) ])
					])
				])
			]));
			return node;
		}

		var caps = (status.capabilities  && typeof status.capabilities  === 'object') ? status.capabilities  : {};
		var sig  = (status.signal_info   && typeof status.signal_info   === 'object') ? status.signal_info   : {};
		var cell = (status.cell_location && typeof status.cell_location === 'object') ? status.cell_location : {};

		var connected = (status.data_status === 'connected');
		var txMbps = String((((caps.max_tx_channel_rate || 0) / 1e6) | 0));
		var rxMbps = String((((caps.max_rx_channel_rate || 0) / 1e6) | 0));

		node.appendChild(E('div', { 'class': 'cbi-section' }, [
			E('h3', {}, [ _('Local Information') ]),
			E('div', { 'class': 'table' }, [
				renderRow(_('IMEI (modem identity)'),          status.imei   || _('N/A')),
				renderRow(_('Max data speed (DL / UL)'),       rxMbps + ' Mbps / ' + txMbps + ' Mbps'),
				renderRow(_('ICCID (SIM identity)'),           status.iccid  || _('N/A')),
				renderRow(_('IMSI (subscriber identity)'),     status.imsi   || _('N/A')),
				renderRow(_('MSISDN (phone number)'),
					status.msisdn
						? (String(status.msisdn).charAt(0) === '+' ? status.msisdn : '+' + status.msisdn)
						: _('N/A')
				)
			])
		]));

		if (!connected) {
			node.appendChild(E('div', { 'class': 'cbi-section' }, [
				E('p', {}, [ _('Disconnected: No network connection has been made.') ])
			]));
			return node;
		}

		var rawType = String(sig.type || 'unknown').toLowerCase();
		var sigType;
		if (/^(wcdma|cdma|tdscdma|evdo|cdma-evdo)$/.test(rawType))
			sigType = 'UMTS';
		else if (rawType === 'lte')
			sigType = 'LTE';
		else if (rawType === 'nr')
			sigType = 'NR';
		else if (rawType === 'gsm')
			sigType = 'GSM';
		else
			sigType = rawType.toUpperCase();

		var sigRows = [ renderRow(_('Connection type'), sigType) ];

		var rssi = (sig.rssi != null) ? sig.rssi : sig.signal;
		if (rssi != null) {
			sigRows.push(E('div', { 'class': 'tr' }, [
				E('div', { 'class': 'td left', 'width': '50%' }, [ _('RSSI (received signal strength)') ]),
				E('div', { 'class': 'td left' }, [ renderBar(rssi, -100, -50, ' dBm') ])
			]));
		}

		if (sigType === 'LTE') {
			if (sig.rsrp != null) {
				sigRows.push(E('div', { 'class': 'tr' }, [
					E('div', { 'class': 'td left', 'width': '50%' }, [ _('RSRP (reference signal received power)') ]),
					E('div', { 'class': 'td left' }, [ renderBar(sig.rsrp, -140, -44, ' dBm') ])
				]));
			}
			if (sig.rsrq != null) {
				sigRows.push(E('div', { 'class': 'tr' }, [
					E('div', { 'class': 'td left', 'width': '50%' }, [ _('RSRQ (reference signal received quality)') ]),
					E('div', { 'class': 'td left' }, [ renderBar(sig.rsrq, -30, 0, ' dB') ])
				]));
			}
			if (sig.snr != null) {
				sigRows.push(E('div', { 'class': 'tr' }, [
					E('div', { 'class': 'td left', 'width': '50%' }, [ _('SINR (signal to interference & noise ratio)') ]),
					E('div', { 'class': 'td left' }, [ renderBar(sig.snr, 0, 30, ' dB') ])
				]));
			}
		}

		if (sigType === 'UMTS' && sig.ecio != null) {
			sigRows.push(E('div', { 'class': 'tr' }, [
				E('div', { 'class': 'td left', 'width': '50%' }, [ _('EC/IO (carrier-to-interference ratio)') ]),
				E('div', { 'class': 'td left' }, [ renderBar(sig.ecio, -30, 0, ' dB') ])
			]));
		}

		node.appendChild(E('div', { 'class': 'cbi-section' }, [
			E('h3', {}, [ _('Current Connection Status') ]),
			E('div', { 'class': 'table' }, sigRows)
		]));

		var cellKeys = Object.keys(cell);
		if (cellKeys.length > 0) {
			node.appendChild(E('div', { 'class': 'cbi-section' }, [
				E('h3', {}, [ _('Current Cell Location Information') ]),
				E('div', { 'class': 'table' },
					cellKeys.map(function(k) { return renderRow(k, cell[k]); })
				)
			]));
		}

		return node;
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
