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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 > 2) {
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
outputs[1] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 2;id8_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlk1rg0AYhO/9FXtMILBxP6Q05JCQSg5pC8khRwnZHoQm5mBOpf+96mrYyCuIH+Bhbss4o+u7Pjic
//x/fkdk84Z5Hxw32YiDc2X0TmtVxzfonN909q2K7Zkv1OIiPCY5h4szQh89V0xp5URaraUSXplaRXkard
//a6banVrVSx2XU3TNdOG4XV3W6KpG1zW6X/PcYj9/bPW5YR9fmFnzmVXe3idV1ytJryS9ivQq0qtJr656
//7Rnv10F+yE8TLt8uTc6z9KQMVS565U2C4kMhb0GnbfJwzJJ2nY/1HF/NMljtDu/TF07xLcA3+Abfnfh+
//TLIt3e5RgG2wDbZHw7bqyrYahm23lwuwDbbBdr+9/DHOFq28yPbx3wbbYBts99rJm5BNN3JwDa7B9Vj7
//eBOu1RBco4uDa3A9YBfXHbq4xj8bbIPtkXZx3bqLg2twDa7H2sV16y7emOt/aowv+Q==
