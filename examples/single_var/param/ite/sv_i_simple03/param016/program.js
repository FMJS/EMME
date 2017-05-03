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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmztvwjAUhff+iowgIYX4EiO1YgC1qEMfErRiRFXTAalAB5iq/veSB8WkjorxdRXM2awbOMFOPt2c
//gxOGy/XqY70Kw2CWdKaj6UpcBtHVLImLcXsz7m7HYThfJm/vmw/fDoJe8NmYJWI6ma6i1ubblI2araCx
//VUqruU652lWqsbYabdTmL7NFWheKslqninqnQieuqBfn/Qr6D9fB/aN/M8vqu/l0tNVYW1UVSKtAWgUq
//K+SrOxoMs+XdW7Of2bbT7+4t3HYyysGu/mChPyyunka9SlivmeuNJ6lePs7W9nW5SHrD/t34pnkRAh7A
//U2N4RPkQDzrqujOC01bAiQAOwHEMjqa1xNVUmaKz319iLVKAB/CcKDyiuutYoyO0XccROHhcAzin4HUU
//4JicTqEIcACOvz7neGz0LscSGjymAZpT8DiHYGPmcAAOwPHe3xyCjYm7cfSIFgEaQFMjb0Ps3oYADsDx
//3dsQs7chN49ogAbQ1MnbELu3ATgAx3tvQ8zehhGadCyZAgHXt8vurFJ768oKDWkNjeuZmdzwJre25YqV
//foXUnk/adRvNQcm0X2C/Ls3++HwaPYMf8FMHfoRRNiBZtgyAHbDjfe/5BRZX51GvE9gBO971HWtyxJ/h
//Gh83USkkADfgxiU3ZBASSJbXCgj9BtyccU5gs+emyukcsIEA7ICdE88Ijt92A27AzfnmAzYdR+9ywA24
//8T0bOL7buGAGuQCYqX8ucPxrOPSPfSYCM2CmVpkAOcgECOyAHe8zAWLPBMANuPE/EyD2TADcgBvfMwFi
//zgTISSYAZsBMfTIBYs4EDmXmG9XJdRQ=
