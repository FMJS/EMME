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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 == 2) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id8_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtl71qwzAUhfc+hcYEAoosyZSWDAmJ6dAfSIaMplQdDE3cwZlK3722ZQfFXIOxZOhwNnF8rixd+UPH
//nOeX4vtScM4yE6f7tIge2PIxM/ftmPNTbj6/SsPThq3YzywzUXpMC7EoK2Q9mi/YjapIVTuqJL2S9CpS
//tWutVLtSq4rScXrPzpUeOW5Xlz266tF1jx73vLdZzy9bv27Zyxt6Nrxnnd3HpOp6JemVpFeRXkV6NenV
//Xa894/0mqQ/5psPt7srKZVU9a4s6D0U7SdJ8KOQUdLWtPByrSjuu2/qRn80qWT8fdvM7TvEtwDf4Bt9e
//fF87OZZu9ygCso27G2yDbT+2lS/banq2BdgG22A7bC6/tnNEKm9qQ2RysA22wXbQTD6EbDqRe3KNOxtc
//g+vJ8vgQrtXUXOM/G1yD68BZXHtkcR0ui4NtsA22g2ZxPTqLa9zZ4Bpc/9Msrkdn8cFc/wFueS/n
