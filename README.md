# luci-app-qmi-cellstatus
An OpenWrt LuCI app that adds a Cellular Status page for wireless modems with QMI drivers.

If you have an LTE or UMTS modem that runs via the QMI driver on OpenWrt, feel free to install this app and test it.

## Installation

### OpenWrt 24.10+ / 25.12.x — APK format

Download the `.apk` file for your router's architecture from the [Releases](../../releases) section, then install it via SSH:

```sh
opkg install luci-app-qmi-cellstatus_*.apk
```
or 

```sh
apk add luci-app-qmi-cellstatus_*.apk
```

Or upload it through the LuCI web interface:

**System > Software > Upload Package ...**

## Building from source

The package uses the standard OpenWrt SDK build system. Clone this repository into your SDK's `package/` directory and run:

```sh
make package/luci-app-qmi-cellstatus/compile
```

CI builds (`.apk` for OpenWrt 25.12.x) are produced automatically via GitHub Actions on every push and tag.

## Notes

LuCI apps are written in Lua, feel free to join and help improve this app.

## Road Map

1. Make the connection signal strength and cell location information available as JSON objects (so a home automation server could request the signal strength and cell location information from the router).
2. Improve formatting of Current Cell Location Information.

To learn about the history of this app, please see:

https://forum.openwrt.org/t/cellular-signal-level-indicator/60543/19

![Screenshot](luci-app-qmi-cellstatus-screenshot-2.jpg)
