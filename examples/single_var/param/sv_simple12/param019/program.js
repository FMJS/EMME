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
      var x = new Float32Array(data.x_sab); x[0] = 1.5000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      var x = new Float32Array(data.x_sab); x[2] = 1.5000;
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
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 1.5000";
outputs[3] = "id6_R_t3: 0.1250;id7_R_t3: 1.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAQhnd+RUaQqqaJY1sCMVChigWQytCxQipDJUoZ2gnx38kXjduenX4lsZO3U3QXHzm7eXjP
//7vn+cr36Xq9835vPxHQ8XbFbb9AfxJ+7+UxuGXx/sZx9fMa3Pg29e+/nej4Lp5PpKujFY1l6ddPzYmuU
//XIeJladXmTWLnlizsJk1iO9YvM+/EnuoxFDtTGOPlOiqnWvsQvN38+f59R5eHr3n1zbmtvPsIZkRnacg
//I6hxORmXk3E5GZeTcYtZVeMWVjWuJO+Vu/dmazwejtJF3or2P2vxyEEyWucMTM7Q5GQmZ2RycpNTmJwy
//d0pTntKUpzTlKek882ke5a8S+WT06Gzk2yQfeczre+UDZoAZYFYPzCrmFTFdzGaUiZIlOwRwABlABpBZ
//pcr2WbVJL9K7uN4l3YAYqwxiQcgBMUCsUxDbjBvo1U2gd4XlmuhifBLOoOuYhYP6ArgALhvVl6iRbdK9
//AhJgA9gAtg6UlZuvQKR3cb3LEbSpX3SUlYAYIOZKWXkmn4Qz6KIXrjpwQX0BXFBfjZaV3dBedYMNigxg
//A9hqLSuP2tc/hHoOnlYCbUAb0NaSM8y275OVLxxwBpwBZy4qNV4j8VpzstnAjlvQ5x3AXWovMuoKBIuM
//1OiFlZNWYZqz1MrIuIyMy8i4jIx7GoiNcEXL0752lXrtKvXaVVIkP7rVKVT/N5U2Ou2/ssAasAasofnJ
//AqiVNT3RqAPSgDQgzSmlVkMblFU4Y5XgbGefDTgDzjqKs7Y2RDUCsRO2S6HIgDAgzHJF1mxrlLXlJRAH
//xAFxnSw6L/7jD6sgR594ougEzoAz14rOOtulLCo6q0EYFBkQBoR1oXHKgaITKg2IA+JaW3TW0EJl7Ukn
//IAfIAXKtPf9s637a+V0FABvABrC5od6abaty7FT0UuD7A7aLtgg=
