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
  connection type (LTE/UMTS), and current cell location information.
endef

define Build/Compile
endef

define Package/luci-app-qmi-cellstatus/install
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/controller
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/view
	$(INSTALL_DATA) ./usr/lib/lua/luci/controller/cellstatus.lua \
		$(1)/usr/lib/lua/luci/controller/cellstatus.lua
	$(INSTALL_DATA) ./usr/lib/lua/luci/view/cellstatus.htm \
		$(1)/usr/lib/lua/luci/view/cellstatus.htm
endef

$(eval $(call BuildPackage,luci-app-qmi-cellstatus))
