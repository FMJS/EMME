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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
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
outputs[1] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 1.0000";
outputs[3] = "id6_R_t3: 0.0078;id7_R_t3: 1.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt27tOwzAUBuCdp8gIUkWaOLYRiAGEKhZAKgNjhFSGStyGMCHendxo3PbYodCmvvxM0XF8iJP24zjG
//cfz2Ubx/FHEczWcin+YFO43Gx+Py52w+k0uBOH55mz09l6deX0bn0efhfJbmD3mRjMq+rD46GkVlNKuO
//0yrK66Mm2mSvok3aJpqUZ7w8zl+reKrkUONME8+U7Gqca+JC83vb6/mKLm6vops7H8e2cu0pOSJ6nILM
//oOblZF5O5uVkXk7m7e6qmreLqnklea5cPbd5xtPLSf2Ql7L93LWy57jqrWtMTI2pqZGZGjNTIzc1ClOj
//bBulaZzSNE5pGqekx9ne5kn7VSKvjO7d9Lx/aHtu8vU9iIEZMANmw2C2Y6+I28Vspkz0PLLfAAfIABkg
//s6oqW7dqMbxM38T1TdINxNgOEZMnQAyIhYTYot9YX90k+qa0vybamk/CGbo2eXCovgAX4LKx+hID2ibd
//m0ACNsAG2AKYVi4+Apm+ieubHKFN/aADMSAGxFyZVv7TJ+EMXfSDA1yAC3B5Oq0Mo/YCbIANsHk9rdzo
//vf5v1HNwtRK0gTbQ5skapu/vyfofHDgDZ+DMxUqNDyieNyube+AuCYK7Ot6NKBQEuxGp2bsoJ6PCdM/q
//KCPzMjIvI/MyMu/fIDbiii1P67Wr1NeuUl+7Skryjbc6perfpt6NTutfWbAG1sAaNj9ZgFrfpieaOpAG
//0kCaU5XaANugrOKM7Yizpa1P4AycBcqZrxui9oLYH16XoiIDYSDM8opsv1ujrJ1egjgQB+KCnHRu/Z8/
//rEKOXvEEZ+AMnLk26Rxyu5RFk04QBsJAWDCTTr/rMRAH4kBcYJPOAbZQWbvSCeSAHJDzdv3T1/dp/99V
//ANgAG2Bzo3rb77Yqx1ZFtwXfNw19tZ8=
