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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 256";
outputs[2] = "id6_R_t3: 65536";
outputs[3] = "id6_R_t3: 65792";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmE9rwjAYxu/7FDkqCGkT07HBDpMhXnTgDh7LoB4Kc+5QT8PvviTVNGha+tc4eG7hyZu3b5Pf85aG
//0v0h+zlklJI0ieJ1nPFnElC62yfbLykuZuSF/I7ShMWbOAsnMorr0XhCpDpVY6ZUoUe5Gsrx7jP9Vjqz
//om2dl+jTkjxl+fOax0fyunojy/f/Ua3WixrtLIUqnKqdgTszcGcG7sxQ7Iitiks13931bK63d3TWVcT5
//7eTKQK0umwyrJlnVpHn8/HS4jqg84mOjIo4PFFAD6p6g7sLt5aQ5iKAG0rroq7UAHaB76N4NQTcbHjYH
//nQN0gD4k6O2bdp+Y20fYBn4mIuAP/P32efNCLQxwWgvUgfr9d/ouoLs7fX38IyE4DAAD3PRG5todpnTW
//3AICsAN2rzc1jbp9F9Td3R4GgAH8dvvKS5o+DcBhABjAjwHaXt4M3/+7m+LxicEUMMXgXwXrT7dPW9hb
//AQPAAPf6VRgI/8o7oBqm+AOA0XOh
