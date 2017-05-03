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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[7] = "id6_R_t2: 3;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtMvkQxYNFihcV6qHHIMRDwFoP6Un6302aD9Jkoslmk43w3srsbJNuysPw
//Ein3h/jrEEspotALNkFs34jlbRT6xWcpd/vw/SNpeFyJO/F9GYV2sA1ia5HsoNOnq4U4qzps1a1Uie0l
//ttdhq9m9ptXsTrOqlXTs3qLPtG5Xuqt1aqk7LXW3pe61XDe/n6O4f34QTy84s+5nVvv1Hlut9hLbS2yv
//w/Y6bK/L9rr13uwZb1br00M+O+Hi1yU7l+nutkUrX/S5Rfu3RSouv87/Yuz387uzna/bdOfxQnIIEBAA
//AkBAFwJWA4HymJfjE8BcVRkGTAeAATCMOB2Ux2lNCQMNhgETA2AADMNgaAwFU7Fgsw+ctE4LBBSAAlAw
//kyVQY7E8cHtAklCr59/Zc1oADIABMBjJF3Sw0DldUMYCUwSwABbGMwe9WNBIWGCyABbAwnAOoUaFUgqh
//ZarwvWtQASpAxVzedCgPlvSlE67SDAEaQANomM37D/1hUM0nXEwS4AJc/O+3IoZwQSNxgekCXICLGb4r
//0QULHRmF4mThW6ACVICKCTOKSmqpM6FwWC4UJwiwABbAwoT5hFYU/konhlKBCQJUgApT2cRIVNAoVGCq
//ABWgwkwuMRCKPqlEdyZ+AO+VXyQ=
