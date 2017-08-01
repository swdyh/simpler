.DEFAULT_GOAL := build
NAME := $(shell ruby -rjson -e 'puts JSON.parse(File.read("package.json"))["name"]')
APP := $(NAME).app
ICONSET := icon.iconset
ARCH := x64
PLATFORM=darwin
$(eval APP_VERSION := $(shell ruby -rjson -e 'puts JSON.parse(File.read("package.json"))["version"]'))
$(eval ELECTRON_VERSION := $(shell electron -v | sed s/v//g ))

build:
	dotenv scripts/build.sh
dev:
	$(eval dir := $(shell pwd))
	osascript -l JavaScript -e "Application('Terminal').doScript('cd $(dir) && electron .')"
run: build
	open packages/$(APP_VERSION)/$(PLATFORM)-$(ARCH)/$(APP)
clean:
	rm -rf packages/$(APP_VERSION)
icns:
	rm -rf $(ICONSET)
	mkdir $(ICONSET)
	cp icon/icon_1024.png $(ICONSET)/icon_512x512@2x.png
	cp icon/icon_512.png $(ICONSET)/icon_512x512.png
	cp icon/icon_512.png $(ICONSET)/icon_256x256@2.png
	cp icon/icon_256.png $(ICONSET)/icon_256x256.png
	cp icon/icon_256.png $(ICONSET)/icon_128x128@2.png
	cp icon/icon_128.png $(ICONSET)/icon_128x128.png
	iconutil -c icns icon.iconset --output icon/icon.icns
	rm -rf $(ICONSET)
