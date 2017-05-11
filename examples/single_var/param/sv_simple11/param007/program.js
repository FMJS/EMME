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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 512";
outputs[2] = "id6_R_t3: 131072";
outputs[3] = "id6_R_t3: 131584";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmL1qwzAUhfc+hcYEArIkqy2FDgkldGkL6ZDRFNzB0DQZnKnk3SvJiS0S2fhHrlI4mzi6urmWvnNF
//ROl2n+/2OaUkS2+TVZKLBxJRutmmn19KfF6QR/IzyVKerJOczVSUMKPpjCg11mOuVWlGhcrUePORfWud
//W9G2Lmr0uCZPXf6i5umBzF+fyMvb/6jW6FWNdpZKlU7VziCcGYQzg3BmqHbEVuW5WuzuarE02zs56Tri
//9HVqZaRX102ypkneNFn+/PJ4uI6oIuJ9rSMONxRQA2pPUA/h9nyyPIioBdKm6Iu1AB2gB+jeHUEvN5x1
//B10AdIA+Juj9m7ZPzO0j7AO/ZBz4A/+wfb78oB4GOK4F6kD9+jv9ENDdnb49/kyw6A4OgAP+9Enm0h5l
//6by7ByRoB+1h32o69fshrLv7PRwABwTu943vND4dIOAAOCCQA/o+4Ix/A3hwhbyP4Qq4YvR7wfq769MX
//9lbAAXDA1d4LI/Hf+BLUwhW/Isl0fQ==
