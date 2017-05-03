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
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      var x = new Float32Array(data.x_sab); x[2] = 1.0000;
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt289PwjAUB/C7f8WOmhAH69oajQeJIV7UBA8ciQkeSEQ8wMn4v7uxyQq8dvzYRtt9PZHX9Uk3+Pi6
//+cJwvlx8LxdhGEwnYjwcL9ht0L3uJj9304ncCIThbD75+EwOfeoH98HP5XQSjUfjRa+TzGWrV1edIInG
//6esojfLVqyyaZU+jWdos2kuOmL1Pv9J4pORQ40wTj5Xsapxr4kLze/P38xs8vDwGz68+rm3rvUfkiuh1
//CjKDmpeTeTmZl5N5OZm3OKtq3iKq5pXksXL72OwaD/uD1UXeyPZ/1pKZ3XS2brBnGoxMg8w0GJsGuWlQ
//mAZlPihN65SmdUrTOiW9zvw0D/KvEvnO6NnZzLdRPvOQr+9FCMyAGTBrBrOavSJOF7OZMlFyyfYBDpAB
//MkBmVVW2a9V6ebF+iOuHpBuIMSAGxIBYRYit53X11U1PPxSV10SV+SScoeuQCwe4ABfgsrH6Eg3aJt3b
//QAI2wAbYWrCtXH8EYv0Q1w85Qpv6Qa8aMXkDxIAYtpX1bCtP9Ek4Qxd94eqEC9UX4EL1dcZtZTtqL8AG
//2ACb19vKg+7r76Oeg08rQRtoA22ePMP0/T5Z+YUDZ+AMnLlYqfEGxfPmySa4q5OEYkVtQbBYkZq9iHIy
//KkznbBVlZF5G5mVkXkbmPQ5iI65oedqtXaW+dpX62lVSkh/c6hSpf5tKG512v7JgDayBNTQ/WYBaWdMT
//TR1IA2kgzalKrYE2KKs4Y+AMnIGz2jjztSHqLIgdcbsUhIEwEGZ5RXbe1ihrt5cgDsSBuFZuOiv/5w+r
//kKOfeJ7OWQsbo8AZOGtNu5RFm866CENFBsJAmP+NUw5sOkEciANx3m46G2ihsvZJJ5ADckDO2+efvt5P
//O72rALABNsDmRvV23rYqx56KVgXfHx4jtZQ=
