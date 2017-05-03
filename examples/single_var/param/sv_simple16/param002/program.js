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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28FOwkAQgOG7T9GjJiSl3V1INB4khnhREzxwJCb10ETEA5yM7y7QggWm2Ep325L/RmZnobTwZbKT
//8f3ZYv65mPu+F0e9yWgyD6+97k0c9TevfX86i97elwkPA+/W+7qMo3AynsyDznKHWr+66ng7US1GTSaq
//xFwl5moxmlzrKppcaRINlhnT1/hjFQ8z2dm4yonrnLjJifdyPje9nm/v7unee3zmnhW/Z3vfvidGs7lK
//zFVirhZztZhrxFyzn5s849FguH7IO3d48+2WO7ur3XmLwbHF8NiiShf7x3b25Z3phQ/TH6f4/vLuZOfL
//ON1Z5g9x4UvYBGADNmBTFTane/K7uH1AXfvUCJ9aGqDj0ISmBzVQAzVO6pqS1GwfROCSGmWNmj7UQA3U
//VEXNqYVL3dCE4k/IFj+c34AP+DSyztG18KMtQcPZDdAATQOrHN2gKkdT5YAP+Jxvl+pQpu2NDV3yY6hy
//gAZoWt2hKlXl1MOMXOUYulbwAz8tr3MKNKbq5kc55odOFvzAT2X8nNasambt45Ykzn0ACZDqqod000jS
//TvHhLAh8wKeeaki3oxrSVEOABEjMahWd1TpczHD2/0mtvXj6nn/Pb1H5AA3QnN+cVhXMFJ7S+hsf+l1A
//AzTnOKVVLTTKGjR0toAGaFo7o2WvnrGPD6c20AM9LZ7QqhYfbYkZzmxgBmZaO5/losLRVDjQAz1MZ9nF
//x1DhwAzMMJvlvsIxdKrAB3yYzHLXp3KBD90r8AGfls5lue5d2QeJ8x44gqPWTmXZ62dxBgQ90MNMVkN6
//XFVy9AOcOWV8
