SOURCES := $(wildcard *.png)
JPGS := $(SOURCES:.png=.jpg)
WEBPS := $(SOURCES:.png=.webp)

%.jpg: %.png
	convert $< $@

%.webp: %.png
	convert $<  -quality 80 -define webp:image-hint=photo -define webp:auto-filter=true $@

all: $(JPGS) $(WEBPS)
