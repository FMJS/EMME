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
      var x = new Int8Array(data.x_sab); x[1] = 3;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMmTOA0biwMY0bNamLLokJLkisdUFXpu8ulEsoHJTC0EL9d82ZM1yG5gvz
//BynXm/BrE0opAt/xFl6obsT0NvDd7LeUq7X//hE1PM7Enfi+DHzlLb3QmkQzaPfraiL2qpqt2oUqsb3E
//9mq2mlxrXE2uNKlaUcfqLfiM66rQXaxTTV3X1O2aulNz3vR6tuL++UE8vWDNmq9Z6e4dtlrsJbaX2F7N
//9mq212Z77XJv8owXs/nuIe+tcHZ30cxpPLtu0EoHXW5Q/TZI2enn6V+MPT4/O5n5uoxnbi8kEAACQKBX
//BKwKAvkyT/sngDlraxhc5xo0gAbQ0N/7Qb6c1jFpINAAGkDDyWmovBgcCwbFPvDuLGArARSAwgDyBKoM
//5guuOqQJpXp6TMAAGADDGDIGEyw0ThhaY4HNBbgAFwPIHcxyQeACXICLc80i2mHRKokwsg2J2AAVoAJU
//DOWLh3xhyVxCYYMG0AAaxv0dxOEwtM0o7JabDoABMADGYL6O6AIGAQyAATD+0zcTTbgwkVNgMwIqQMUY
//copCcmkypdAsF2ABLICF4WcURlH4K6HoSgW2G8ACWJwun+gJCwIWwAJYnFU20ZGKQ5KJ5lD8AAh2YsA=
