CFLAGS=-m64 -Ofast -flto -march=native -funroll-loops -fomit-frame-pointer

all: genpsl2z genarith

genpsl2z: genpsl2z.o

genarith: genarith.o

clean:
	rm -f *.o genpsl2z genarith

.PHONY: clean
