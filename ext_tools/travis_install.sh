#!/bin/bash
BINDINGS="`pwd`/CVC4/python_bindings/CVC4.py"
if [ ! -f "$BINDINGS" ]; then
    pushd .
    wget https://downloads.sourceforge.net/project/swig/swig/swig-3.0.12/swig-3.0.12.tar.gz
    tar xvf swig-3.0.12.tar.gz
    cd swig-3.0.12
    ./configure --prefix=/usr
    make
    sudo make install
    cd ..
    rm -fr CVC4
    wget https://github.com/CVC4/CVC4/archive/1.5.zip
    unzip 1.5.zip
    rm -fr 1.5.zip
    mv CVC4-1.5 CVC4
    cd CVC4/contrib
    ./get-antlr-3.4
    cd ../
    ./autogen.sh
    ./configure --with-antlr-dir=$PWD/antlr-3.4 ANTLR=$PWD/antlr-3.4/bin/antlr3 --enable-optimized --enable-language-bindings=python
    make
    mkdir python_bindings
    cd python_bindings
    cp `find ../ -name "CVC4.so"` _CVC4.so
    cp `find ../ -name "CVC4.py"` CVC4.py
    export PYTHONPATH=$PWD:$PYTHONPATH
    export LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
    echo "================================================================================"
    echo "run export PYTHONPATH=$PWD"
    popd
else
    echo "CVC4 Python bindings already exists!"
fi

wget https://github.com/cristian-mattarei/compiled_softwares/raw/master/v8/ubuntu-14.04-64/package.zip
unzip package.zip
rm -fr package.zip
echo "`pwd`/v8/v8/out/x64.release/d8 --test --random-seed=\$RANDOM --use-strict --nohard-abort --nodead-code-elimination --nofold-constants `pwd`/v8/v8/test/test262/data/harness/sta.js `pwd`/v8/v8/test/test262/data/harness/assert.js `pwd`/v8/v8/test/test262/harness-adapt.js `pwd`/v8/v8/test/test262/harness-agent.js --harmony-sharedarraybuffer \$1" > run_v8.sh
echo "for file in \`find \$1 -name \"*.js\"\`; do python litmus.py -c \"bash `pwd`/run_v8.sh\" -i \$file -s -n \$2 -j 1; done" > run_all_v8.sh
