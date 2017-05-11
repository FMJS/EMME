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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhsdFwtLT00lNBLW0gPOUrBHoSm6cGcSv57NX5gdGyN7kYt7y3Mzkazhofh
//RSm3u+hrF0kpwsD1V35k34j5bRh4+WcpN9vg/SNueFyIO/F9GQa2v/YjaxbvoMOnq5k4qjpsVZWqxPYS
//2+uw1fRek2p6p2nVijs2b+FnUrdL3eU6NdSdhrpqqLsN183uZy/unx/E0wvOrP2ZVX69y1bLvcT2Etvr
//sL0O26vYXlXtTZ/xarE8POSjE85/XbxznuxuWrSyRY9btH9bpPzyy+wvxn4/vzvd+bpOdu4vJIcAAQEg
//AAR0IWDVECiOeW6eAOaqnWHAdAAYAIPB6aA4TuucMFBvGDAxAAbA0A+G2lBwLhZs9oETpgWgABT+Q5ZA
//tcXiwO0eSUKlnn0npgXAABimkC/oYKF1utAZC0wRwAJYDJ456MWCDGGByQJYAIuBc4huVHRKIbRMFZ57
//DSpABagYy5sOxcGSvnRCdZohQANoAA2jef/hdBi65hMKkwS4ABfTfiuiDxdkiAtMF+ACXIzwXYk2WOjI
//KDBZgApQMYWMopRa6kwoHJYLTBBgASyMP5/QisJf6URfKjBBgApQMVQ2YYgKMkIFpgpQASqGySV6QnFK
//KtGeiR/bfF8w
