NAME = SimplenoteElectro
APP = $(NAME).app
ICONSET = icon.iconset

build:
	electron-packager . $(NAME) --platform=darwin --arch=x64  --electronVersion 1.6.6 --icon=icon/icon.icns --overwrite
	rm -rf $(APP)
	mv $(NAME)-darwin-x64/$(APP) .
	rm -rf $(NAME)-darwin-x64
	echo create $(APP)
dev:
	PWD=`pwd`
	osascript -l JavaScript -e "Application('Terminal').doScript('cd $(PWD) && electron .')"
	# electron .
run: build
	open $(APP)
clean:
	rm -rf $(APP)
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
