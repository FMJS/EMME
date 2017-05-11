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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 > 2) {
         var x = new Int8Array(data.x_sab); x[0] = 1;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 1;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 0;id6_R_t3: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlr0OgjAUhXefoqMkJgWMDBoGiBIHfxIcHIkRBxIBB5iM725LLVSKGkRilLvdnPbc3jZfTopxnCan
//NMEYBf7Qc71EHyN1EvgGrYekxjiM/cORbJjbyETnPt83II6RtyWVMkBE1Ugd7oKI6jrVNVlnTll/1IdN
//oVyQtZqi5fpb52c661nuUqhij0IVOxRziyrzSbd1bSe77p2Pz0acKnX3uanOosZPcKT3FHZVu5lzs6VO
//Vmcvto8j33SsxWam9DAg9UtI5fdqBSjx1QAnSCiBmfKiAOL7+VTSbz0Bs26m1nuQvcis9hDTRwZA9he/
//rXw67XNZdusJoMEfrA5m9dIMIOtmmj0hsEmWVcMHkHUxyRoiVo1SQ8CuAzqSAA==
