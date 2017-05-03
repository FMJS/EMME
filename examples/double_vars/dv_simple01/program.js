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
      var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 1);
      var y = new Int16Array(data.y_sab); Atomics.store(y, 0, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var y = new Int16Array(data.y_sab); id6_R_t2 = Atomics.load(y, 0); report.push("id6_R_t2: "+id6_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
   y_sab : new SharedArrayBuffer(8),
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
outputs[0] = "id5_R_t2: 0;id6_R_t2: 0";
outputs[1] = "id5_R_t2: 1;id6_R_t2: 0";
outputs[2] = "id5_R_t2: 0;id6_R_t2: 1";
outputs[3] = "id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtVT0LwjAQ3f0VGRWEmI86KA6KiIsKOjgWoQ4Fv4Y6if/d1tT2bO+MtFUQu6Xvci+51zwe58dzcDoH
//nDPfc9ylG8ge6/R9r/tYc74/ettduGE6YgN2afqecNfufuMf2mGPjNetNgsrKvwKRITr+8qghjdCDatB
//IYsCuyGuCdwheCC/JHhkfv+VDedjNlv87HyKmI+a2yF4IH86K0TTWRWqADyxm0WNzsvR5C70U59Ide5E
//3VRRxMWUW+Y70WJy/CT+zSg/3m06V2vkgVikvDY4ZjHxbxbL3N159dBqOxbXriI7JhPkzZiUPmJFhV6Y
//MuLbYhE2hEkn/tCGENW1DQunoi6TlR9JRZ01MFIqkIhPV7bmYf5J2dNQ1GlYm/MLGanRvYTOFWZkSWMq
//e6AntlRvjngDZd8ppw==
