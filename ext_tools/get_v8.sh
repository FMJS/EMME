mkdir depot_tools
cd depot_tools
wget https://chromium.googlesource.com/chromium/tools/depot_tools/+archive/master.tar.gz
tar xvf master.tar.gz
rm -fr master.tar.gz
cd ..
export PATH=`pwd`/depot_tools:"$PATH"
mkdir v8
cd v8
fetch --no-history v8
cd v8
./tools/dev/v8gen.py x64.release
make -j4 x64.release
cd ../../
echo "`pwd`/v8/v8/out/x64.release/d8 --test --random-seed=\$RANDOM --use-strict --nohard-abort --nodead-code-elimination --nofold-constants `pwd`/v8/v8/test/test262/data/harness/sta.js `pwd`/v8/v8/test/test262/data/harness/assert.js `pwd`/v8/v8/test/test262/harness-adapt.js `pwd`/v8/v8/test/test262/harness-agent.js --harmony-sharedarraybuffer \$1" > run_v8.sh
echo "for file in `find \$1 -name \"*.js\"`; do dir=\$(dirname \"\$\{file\}\") python litmus.py -c \"bash `pwd`/run_d8.sh\" -i \$file -s -n \$2 -j 1; done" > run_all_v8.sh
