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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
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
outputs[1] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[2] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[3] = "id2_R_t1: 0;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGwgxNlXY2GFllF22QXfoUQbuIKzrDvY0+t0X51uaRHyLiuN/k8fkMUb5IX+k
//9HhKvk8JpSSOvHAXJuyWuHdxtE6PPXFM6eEYfXyKAU8bck9+rotxjpixCvfi6MYhF1UuVbMRajXrnlb9
//tOqp1UCqZiPUKhPHh/f4yynXrdfl1cl1XlPPrq/X/Zrr5us5k4eXR/L8it0x7Y5y93KXquobx8odqp2S
//O1RV3zhW7sCNHbixA1c7ZM94t9n+PeSLVRb3LGa66ey6kyw/WT1Hw0zjSVZcfqu9YtIo8+xs5ts+n9nm
//xci353xFgQNwAA6WcGAaDmVTd3wazNvZDQzAABgAwwRfDeUC2JQwBIABMACGmWHQPgqmYqF508ZCwQMK
//QAEojJ0x6CfLx+MOSBiUet6zOXcADIABMMyfL9hgoXW60IwFWAALYGH+dMEuCwFYAAtgYenZQj8UeiUL
//VkhYM6AAFIDCDP8vlI+B2csWuMVsATSABtAww98L3WHomy5wfDMABsCwlL8XhsAQAAbAABj+498LbViw
//kTD0RYEDBaAAFEZJGKR00Wa+sDK+SnbTBbAAFsDCGOmCVRSasoXWVAAFoAAUZksWRkIhAApAASgsMlUY
//SEKXTKE9CL8PjzAg
