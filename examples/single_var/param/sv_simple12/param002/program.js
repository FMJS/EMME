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
      var x = new Float32Array(data.x_sab); x[0] = 0.5000;
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      var x = new Float32Array(data.x_sab); x[2] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.0000;id7_R_t3: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt289PwjAUB/C7f8WOmhDH1rVNNB4khnhREzxwJCZ4IBHxME7G/939khV47UBgtN3X0/Le+lw3+Niu
//NgwXy/RrmYZhMJuKyWiSspugf93Pfm5nU7kWCMP5Yvr+kZ36OAjugu/L2TSejCdp1MvasuLoqhdk0SQ/
//jvMoL47KaFk9j5Zly2iUnTF/m33m8VipocaZJp4o1dU418SF5vdW1/MT3D8/BE8vPvZt49pjskd0PwVZ
//Qa3LybqcrMvJupysW99VtW4dVetK8ly5eW75jEeDYfGQ16r93bWsZT9vrUtGpmRsSjJTMjEluSkpTElZ
//JaWpn9LUT2nqp6T7Wd3mYfVVIq+Mbl22fB1XLff5+l6EwAyYAbN2MDuxV8TtYjZTJhoe2S7AATJABsis
//GpVtW7XqXqJPcX1KuoEYA2JADIgdCbFVu75+dBPpU3HzmOhoPgln6NrnwQEuwAW4bBx9iRZtk+5NIAEb
//YANsHZhWrj4CiT7F9SlHaFM/6EAMiAExV6aVB/oknKGLfnCAC3ABLk+nld0YewE2wAbYvJ5W7vVefxf1
//HFytBG2gDbR5sobp+3uy5gcHzsAZOHNxpMZbFM+blc2zcMc7wF0Rr3vUFQTrHqnV6ygno8J0z4ooI+sy
//si4j6zKy7v8gNuKKLU/bY1epH7tK/dhVUpLvvdUpVv82NW502v7KgjWwBtaw+ckC1Jo2PdHUgTSQBtKc
//Gqm1sA3KKs4YOANn4OxknPm6IeosiP3jdSkIA2EgzPIR2Xm3Rlk7vQRxIA7EdXLSefR//rAKOXrFE5yB
//M3Dm2qSzze1SFk06QRgIA2GdmXT6PR4DcSAOxHVs0tnCFiprVzqBHJADct6uf/r6Pu3wXQWADbABNjdG
//b+fdVuXYquix4PsFZZG1rQ==
