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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 2;
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
      if(id4_R_t2 > id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tPwkAUhff+ii4hISnMpUOiYQFR4sJHAhqWjbEumgi4KCvjf7cvZMBp7GMGh+nZTW7paXvpl3t6
//0rruZht9bCPXdcJg6M/9iF06/asw8IT1aLd23dUmeHuPf3w7dcbOZycMmL/0o0Ev3pvSVbfndHZKSTXT
//Oa6OhKonrQ5itdVLuE7qTFAW61RQHxboeAX1/LhfzuTh2rl/tO/K0vr+eobSqietigokVSCpAh0rZN2d
//T2dpew96tjvjeM9+svdB6yQbR/KN+RFm+f8n1S+Slqtmiotlopit0/6+btbBeDa5W9x0L9y/AGIACAD9
//J0A/LVKNj9h7hfAwwAN4TgjPLz4UoiN2GOAAHKvAIY3g0CnBgV0DOMbYNdJl1whTB/BYbddIj10DOADH
//brtGeuwa6bdrYjzNAA7AMSqeFmaVsnA611T9rAN4AI9J0XQTdOQxQUNwGMABOMbH0mWwqRJKAxpAY30k
//XQYaOh00sGiA5hzi6CYWjTBtAE47o+j6Fg3QAJqWxtD1LRrptmiIoAGNuRE0aYigCc83gMf+CJqUR9AE
//qwZwbI+gSXEEDWgAjfURNCmOoGHRAE0LImhSHkFj2gAc6yNoUhxBAxpAY30ETYojaIXQJHaNK/p8QPft
//sj8ql966vECDN4ZG95VVueGr3NoNO3Z0Flx6PN5k0kjcG1fy5c2hdePVPiF4mj+DHbBjAjuklR0ygh0G
//dsCOQXOn/ms2ReSUeGcA3ICbM5859d+0ATfgpr3zhpTPGwI34Mb6eUPK501Zbr4BHI53Sw==
