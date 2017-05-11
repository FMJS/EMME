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
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rgzAYBvD7PkWOGxRS8xodGzusjLLLNugOPcrAHoR13cGeRr/7tFqx7etmY6wpPDd588Y/UX7I
//Q6RcrdPvdSqlSOIgmkWpuhPj+yQOd8dSLlfx4jNreJ6IB/FzncQqmkepN8pm0PboZiT2qj5b1bUqsb3E
//9vpstbjXvFrcaVH1so7lR/KV11Wtu16nhrrfUNcN9aDhuuX9bMTj65N4ecOatV+zg6cP2Gq9l9heYnt9
//ttdnezXbqw97i3c8m0y3L3lvhXdPl80c57ObBr1yMOQG1V+DtLv8tPzE2PPzs4uZ7/N85uZKcgh4QAAI
//AAFbCHhHCFTLPO6fAOaqxjAoHYAG0AAa+vs/qJbTOycNZIGGEDSABtDQiYajH4NzwaDYF96dBeQJQAEo
//OJAn0NFgteCqQ5pwUC/PiYwBMACGS8gYbLDQOmEwxgK5A7gAFw7kDna5oN64QBYBLsDFwFmEGRZGSYQx
//FfV8IgxuQQWoABWu7HioFpbsJRTaKKEADaABNDizD+J0GEwzCm2YUQAMgAEwnNkd0QUM6g2MEGAADIDh
//3p6JNlzYyCk0cgpQASouIKeoJZc2Uwqf5QIZBVgAC+5nFFZR+C+h6EoF8glgASyGyyd6woJ6wgLZBLAA
//FsNkEx2pOCWZaA/FL0ylYog=
