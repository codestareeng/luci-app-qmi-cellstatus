# SPDX-License-Identifier: GPL-2.0-only

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-qmi-cellstatus
PKG_VERSION:=2.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=Peter Rottengatter <peter@rottengatter.de>
PKG_LICENSE:=GPL-2.0-only

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-qmi-cellstatus
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=Cellular QMI modem WWAN connection information and status
  DEPENDS:=+luci-base +uqmi
  PKGARCH:=all
endef

define Package/luci-app-qmi-cellstatus/description
  Adds a Cellular Status page to LuCI for wireless modems using the QMI driver.
  Displays IMEI, ICCID, IMSI, MSISDN, signal levels (RSSI, RSRP, RSRQ, SINR),
  connection type (LTE/UMTS/NR/GSM), and current cell location information.
  Uses the modern JavaScript LuCI framework (OpenWrt 24.10+/25.x).
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Compile
endef

define Package/luci-app-qmi-cellstatus/install
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/cellstatus.js \
		$(1)/www/luci-static/resources/view/cellstatus.js

	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./root/usr/share/luci/menu.d/luci-app-qmi-cellstatus.json \
		$(1)/usr/share/luci/menu.d/luci-app-qmi-cellstatus.json

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./root/usr/share/rpcd/acl.d/luci-app-qmi-cellstatus.json \
		$(1)/usr/share/rpcd/acl.d/luci-app-qmi-cellstatus.json

	$(INSTALL_DIR) $(1)/usr/libexec/rpcd
	$(INSTALL_BIN) ./root/usr/libexec/rpcd/luci.cellstatus \
		$(1)/usr/libexec/rpcd/luci.cellstatus
endef

define Package/luci-app-qmi-cellstatus/postinst
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || /etc/init.d/rpcd restart 2>/dev/null || true
endef

$(eval $(call BuildPackage,luci-app-qmi-cellstatus))
