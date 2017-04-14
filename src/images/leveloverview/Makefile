SOURCES := $(wildcard src/*.xcf)
FILES :=$(subst src/, dist/, $(SOURCES))
PNGS := $(FILES:.xcf=.png)
JPGS := $(FILES:.xcf=.jpg)
WEBPS := $(FILES:.xcf=.webp)

%.jpg: %.png
	convert $< $@

%.webp: %.png
	convert $<  -quality 80 -define webp:image-hint=photo -define webp:auto-filter=true $@

dist/%.png: src/%.xcf
	xcf2png $< -o $@
	convert $@ -trim +repage $@

.PHONY: png
png: $(PNGS)

.PHONY: jpg
png: $(JPGS)

.PHONY: webp
png: $(WEBPS)

all: png jpg webp
