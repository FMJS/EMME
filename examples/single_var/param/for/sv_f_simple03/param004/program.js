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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+1;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
      }
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 256;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[3] = "id4_R_t2_0: 256;id4_R_t2_1: 2";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 768";
outputs[5] = "id4_R_t2_0: 256;id4_R_t2_1: 768";
outputs[6] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[7] = "id4_R_t2_0: 256;id4_R_t2_1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9PwjAYx/G7r6JHSUi6dgpG40FiiBc1wQPHxQQPJCIexsnw3h1/hnRtCbB1hvG9wR6esrXLJ+sv
//k3I6S79nqZRiPLpKBkmqk+hWRHebbyr7JuVkOvr4zH701BP34udyPNLJMElVO+uKl5+SqNUWruPKc1yv
//jufddoejYvY4RsuvoP13NevRVPa7yfv4a1FZnYt93LwSR8Xfo+1Kfi7eimrNxcPLo3h+ZU6rm9PCzJgd
//1nHHvJgdjoqyZ8zZ4/8f7e3Rjvtj0Osvb5DCWuRXn/Uvx/CXlVlWhbLeXY7z0+ivb1PPv/hGWHW/DRfd
//8wsJOIADOCcOjnKAs1mQqGZuouLtcDxD+roDREAERKf85LM18eo/KDIXHozACIyai5HvsadGihzPPpVC
//ZG7ONAzBEAw1NQ2KHeWtxdEl0yCrshkbiqAIisiJgkG0X05UEqjipg2iIAqiGpsghUFqj40bTMEUTJEt
//hUaqRLZU6Vav27mBKIiCqHN6C2lrCeJAuZMGIzACI5KnkBSVS570cVs6kAIpkDqzt5fKM1ViYwdUQAVU
//pE/VMRUgfTpuw9fl5UuIgqhmpU9GBh4ifTKXF4zACIxIn6KaKdqZPlVFlLWpAymQAqmGpU/BmfJv7IAK
//qJhT0qcamTo8fToUqV/0u2oy
