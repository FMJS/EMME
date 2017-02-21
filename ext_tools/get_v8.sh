mkdir v8
cd v8
fetch v8
cd v8
./tools/dev/v8gen.py x64.release
ninja -C out.gn/x64.release -j 20
