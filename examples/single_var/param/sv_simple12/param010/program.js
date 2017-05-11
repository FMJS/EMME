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
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      var x = new Float32Array(data.x_sab); x[2] = 0.5000;
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
outputs[1] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 2.0000";
outputs[3] = "id6_R_t3: 2.0000;id7_R_t3: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt27tOwzAUBuCdp8gIEiKNHdsSiIEKIRZAgoGxQipDJW5DOyHendxo3PbYaWmT2M7PFJ0TH+Kk/WrH
//chx/LuZfi3kcR7OpnDxO5vw8Gp2Nsr+L2VStBOL4/XP6+padejuOLqPv49mUTZ4n8+Q0a8uLo5PTKIum
//+THLo6I4KqNl9Txali2jSXbG+8vsI48zrYYe54Z4qlXX48IQl4b/W13PT3R1fx3dPYTYt7VrZ2SP6H5K
//soJeV5B1BVlXkHUFWbe+q3rdOqrXVeS5av3c8hk/jm+Kh7xS7e+uZS1HeWtTMrElmS3JbcnUlhS2pLQl
//VZVUtn4qWz+VrZ+K7md1m2+qrxJ5ZXTrsuXTc9Vyl6/vUQzMgBkw6wazlr0ibhd3mTLZ8Mi2Ac4OGQNk
//gAyQdTsq27Rq2b3UnBLmlPIDMQ7EgBgQOxBiy3Yj8+gmMadY85joYD5Jb+ja5cEBLsAFuFwcfckObVP+
//TSDbhw3vxwAbYOt9Wrn8CKTmlDCnPKFN/6ADMSAGxHyZVu7pk/SGLvrBAS7ABbgCnVYOY+wF2AAbYAt6
//WrnTe/1t1PNwtRK0gTbQFsgaZujvyZofHDgDZ+DMx5Ga6FC8YFY2e+CODYK7Il73aCgI1j3Sq9dRQUal
//7Z4VUU7W5WRdTtblZN3/QWzFFVueNseuyjx2Veaxq6Ik33mrE9N/mxo3Om1+ZcEaWANr2PzkAGpNm55o
//6rYljYE0kAbSBrINyinOODgDZ+CsNc5C3RDVC2L/eF0KwkAYCHN8RNbv1ihnp5ftEof3aCAOxA1lk5RT
//yNErnuAMnIEz3yadXW6XcmjSCcJAGAgbzKQz7PEYiANxIG5gk84OtlA5u9IJ5IAckAt2/TPU92n77yoA
//bIANsPkxeut3W5Vnq6KHgu8Xtye1mA==
