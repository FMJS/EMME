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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 2.0000;id5_R_t2: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnL1u2zAUhfc+hcYWMKo/igQaZGgQBF3aAumQ0SjgDgby08GZirx75Eq2aYmkFJuSKefzZNxDUqJE
//fbi4R1QcPz2v/j6v4jhaLrL57XyVfomSz0n5u1guinUg2wTi+OFp8ee+bPrtKrqM/n3c9JiVffP5Xfnv
//0yzaiwotWrVoRqtDrKNyHc2aUaVFqxbNaFr+f/i9fJxtZ9CO62enx4UlXh2/HZeW49bn8xJ9/XEdff/J
//1TFdncbs9VF2UWlsq4+wu1L6CLuoNLbVRxDGEYRxBNEcobrHt1c3/2/y3llu5lz2TNa9bWLqEjOXmLtE
//4RILlyhdoqrF3aozzNMopi4xc4m5SxQusXCJ0iWqza29aT2+Witz76rnr7u6Z5+Hrl56Lx9iEAyCQbB3
//BA+MQ8P1SuxSapcyu5SD3n30mhfp24DsBm8GeAEv4J1a7ttG9nbSwi4Vdoms14peBXpBL+gNBr3D55/e
//qCoBrgO43YsQ3IJbcBtMpitPUAsgwx23uDA8iKn1AmJAjN12OrttMPI2xe3Sz48w2xrxesxuCw78gl/w
//i9UWjNUWMHZ7G23dMKb8AHbBLkZbQGWISYBXAV7AC3ix2SZvswWF24Nqu8AW2AJbTDay2yHKCsNjmBov
//GAbDWGyB7mhrc3e7UIVdKuyS8mevCew10At6sdfOayfb6ZB7qLUmKDqAXJCLtTbdN3xDgK4CukAX6GKr
//nffutTFR66OWC2gBLaDFUiOrHW/H2sEIpqYLgkEwdlrniwGJXUrtUuZ608Aza6VXEy03PppYaOAW3GKh
//+bbQ3hlmu4yz3vClsABmwSy2We8Cw7sFrQK0gBbQYpUNapWdPV7fUp0FrsAVuGKPkb2Oaoodi11qtGAX
//7GKJnW6HmRyR08r75xuxzMAxOMYym/yusyAxfOTnHClGgGEwjKU2qXd2AwexAsSAGBBjuZ3p7rRA8Ovx
//O2PAF/gCXyw5st8w9qv1x/Ir2a9rgw==
