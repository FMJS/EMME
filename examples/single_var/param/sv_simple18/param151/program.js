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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 514";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 514";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ0bgkoLixS3KhQF10GIS4C1rpIV9J3N2nSME1PNJ1MLot/F86cyWUSPsLP
//cL7dpd+7lHOWxEG0ilJ5y+Z3SRwejznfbOOPz6zhacHu2c91EstoHaVils1Qh6ObGTuparJqrKoiexXZ
//q8lqca95tbjToiqyjs178pXXpdVt11VDXTfUTUM9aLhueT979vDyyJ5fsWbt16z29AFZtXsV2avIXk32
//arLXkL2m3lu849VieXjJJyt8fLps5jyf3TQoysGQGpR/Darj5ZflJ0aen55dzHxb5zP3V5xCQAABIAAE
//fCEgzhColnnePwHEVZ1hkCYADaABNPT3f1AtpxiSBuWBhhA0gAbQ0ImGsx+DoWCQ5AvvzoKdJ0igABSA
//wjh5gjobrBZcdkgTavXynBdmDIABMACGUTIGHyy0ThicsTjNHcAFuAAXo+QOfrlQvXERggtwAS7GzSLc
//sHBKIpypsPMJI0AFqAAVk9nxUC2s8pdQGKeEAjSABtAwmX0Ql8PgmlEYx4wCYAAMgDGZ3RFdwFC9gREC
//DIABMKa3Z6INFz5yCuOYU2hQASpAxYA5hZVc+kwpNMmFa0YBFsACWBguo/CKwn8JRVcq6vkEsAAWwGK4
//fKInLFRPWITAAlgAi1GyiY5UXJJMtIfiF277YjA=
