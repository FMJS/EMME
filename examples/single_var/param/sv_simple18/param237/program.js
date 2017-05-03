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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwis7rgGWnpoKKGXtpAecpSCPQhN04M5lfz3ajSiZmx1XT8O7y3MzkZdw0N4
//GSn3h/j7EEspotAPNkGsboVzF4XL82cpd/vw4zNpeFqJe/FzHYUq2Aaxu0h20OnTzUJUqh5b1aUqsb3E
//9npsNbvXtJrdaVZ1k47de/SV1lWpu1ynhrrXUNcNdb/huvn9HMXDy6N4fsWZtT+z2tP7bLXcS2wvsb0e
//2+uxvZrt1fXe7B1vVuvTS66c8Pnpkp1Ourtp0c0Xl9yi+muRzpdf5z8x9vv53dnOt22683glOQQICAAB
//IGALAfcCgeKYneEJYK5qDIN2FWgADaBhuP8HxXG6Y9JAFmjQoAE0gIZeNFz8MRgLBsW+8P4slPMEAgpA
//AShMkyfQxWJx4KpHmlCr59/ZMWMADIABMEySMdhgoXXCYIxFNXcAF+ACXEySO9jlggbjQoMLcAEups0i
//zLAwSiKMqcC8A6AAFLOcdygOluzlE9oonwAMgAEwzGQGojsLpvmENswnwAW4ABczmYvowwUNxgVmJcAF
//uJjdrEQbLGzkE9oon0CQCSgAxZj5RCmvtJlOeCwWGrMTQAEozDybsErCf8lEXygwNwEqQMVUucRAVNBA
//VGBmAlSAiikyiZ5QdEkk2jPxC+dxXuA=
