// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 2;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 512;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 514;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[5] = "id2_R_t1: 2;id5_R_t2: 2";
outputs[6] = "id2_R_t1: 512;id5_R_t2: 2";
outputs[7] = "id2_R_t1: 514;id5_R_t2: 2";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[9] = "id2_R_t1: 2;id5_R_t2: 512";
outputs[10] = "id2_R_t1: 512;id5_R_t2: 512";
outputs[11] = "id2_R_t1: 514;id5_R_t2: 512";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 514";
outputs[13] = "id2_R_t1: 2;id5_R_t2: 514";
outputs[14] = "id2_R_t1: 512;id5_R_t2: 514";
outputs[15] = "id2_R_t1: 514;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGa7l0LigeHDC8qzMOOQ5iHgnMetpPsu5vaf1mb2rTL212eW3mbvE3T8qM8
//VMrdYf992Espkk24Xq736lYEd8lmlh6H+ljK7W7z8akHPM3Fvfi5LsZN9IzpeqWPbibipEpGNRtRr2bd
//02qUVsN6NTaq2Yh6Venj7XvyNSnX3aybqzPr1FLPrt+sRy3XzddzFA8vj+L5Fbtj253a3ZtdqmpkHWt2
//qHbK7FBVI+tYswNZO5C1A9U7ZM94OV/8PeSTVRb3rGcG6ey2kyo/WT1Hy0zrSVVcftF4xYxR9tnZzLdV
//PtPlxci353glbTiEwAE4AIf+OKgGDmXTgJ8G+3b2A+N/GGYKNIAG0ODlu6FcgBqThpiNBgINoAE0ONLQ
//+DAYC4buTfPJgpkzhEABKAAF7pyhebJ8PMEZKUOtnvfszh4cMgbAABgAA3PG4IMF54ShGwunhAEwAAbA
//wJww+IUhZoOBAANgAAxj5QvDWBiULgxGwUwX9JcDUAAKQGH8/xjKx6D85QvkMV8ADaABNFzgL4b+MAxN
//GGhgwgAaQANouMBfDOfQELPRQKABNICGS/7F4AKDj5SBBqYMBBSAAlBgSRmMhNFnxjC1vkp+EwawABbA
//AkfC4BWFrnzBmQrHdAEsgAWwwJEuMLEQM7FAYAEsgAXmZOFMFPrkCu4k/AJ3HjNw
