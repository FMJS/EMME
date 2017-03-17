git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH=`pwd`/depot_tools:"$PATH"
mkdir v8
cd v8
fetch v8
cd v8
./tools/dev/v8gen.py x64.release
ninja -C out.gn/x64.release -j 4
cd ../../
echo "`pwd`/v8/v8/out.gn/x64.release/d8 --test --random-seed=\$RANDOM --use-strict --nohard-abort --nodead-code-elimination --nofold-constants `pwd`/v8/v8/test/test262/data/harness/sta.js `pwd`/v8/v8/test/test262/data/harness/assert.js `pwd`/v8/v8/test/test262/harness-adapt.js `pwd`/v8/v8/test/test262/harness-agent.js --harmony-sharedarraybuffer \$1" > run_v8.sh
echo "for file in `find \$1 -name \"*.js\"`; do dir=\$(dirname \"\$\{file\}\") python litmus.py -c \"bash `pwd`/run_d8.sh\" -i \$file -s -n \$2 -j 1; done" > run_all_v8.sh
