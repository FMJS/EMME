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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ05mRSUVxYpLhRoS66DEJcBKx1ka6k727SpCFNTzSdTNKL/66cOZPLpHxk
//fiLlYhl/LWMpRRT6wTSI9Y0Y3kbhaPNbyvkifP9IGh7H4k58X0ahDmZBrAbJDFr/uhqIrarHVk2pSmwv
//sb0eW82uNa1mV5pVVdIxf4s+07oudZfrVFP3auqmpu7XnDe/npW4f34QTy9Ys+ZrVrl7n62We4ntJbbX
//Y3s9ttewvabamz3j6XiyfshbK7y5u2TmMJ1dN6jywRE3qH8bpM3pJ/lfjD0+Pzub+TpLZ64uJBAAAkCg
//UwTUDgLFMg+7J4A5qzUMI/8aNIAG0NDd+0GxnKpPGgg0gAbQcHAadl4M+oJBsw+8PQvlrYQCCkABKBwm
//T6CdwWLBdYs0oVLPjwkYAANgOIWMwQULjRMGayy2NxfgAlyAi4PkDm65IHABLsDFuWYRdlhYJRFOtiFG
//aVABKkDFsXzxUCwsuUsoDGgADaDhtL+D2B8G24zCWG46AAbAABhH83VEGzAIYAAMgPGfvplowoWLnMJ2
//M0KgAlSAih5zilJy6TKl8FguwAJYAAvHn1E4ReGvhKItFdXtBrAAFsCiv3yiIywIWAALYHFW2URLKvZJ
//JppD8QNTmWJg
