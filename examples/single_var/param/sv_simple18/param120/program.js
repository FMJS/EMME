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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 769;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 769;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxTSGKNzY4eVUXbZBt2hRym4g7CuO9jT6HefViupPm42xpfD/yZPnvgS5Yf8
//Cee7ffK9TzhnceSFqzBx7tj8Po780zHn21308Zk2PC/YA/u5jiMnXIeJmKUz5PHoZsbOqi5ZVVpVkr2S
//7HXJan6vWTW/07wq0o7tJv7K6o7WrddlQ91tqKuGutdw3eJ+Duzx9Ym9vGHN2q9Z5ek9sqr3SrJXkr0u
//2euSvYrsVdXe/B2vFsvjSz5b4dPTpTPn2eymQVEM+tSg89egPF1+WXxi5Pnp2fnM93U283DFKQQEEAAC
//QMAWAqKGQLnM8/4JIK5qDIPv3YIG0AAa+vs/KJdTDEmDtEBDABpAA2joREPtx2AoGBzyhXdnQc8TBFAA
//CkBhnDxB1gbLBXc6pAmVenHOCzMGwAAYAMMoGYMNFlonDMZYnOcO4AJcgItRcge7XMjeuAjABbgAF+Nm
//EWZYGCURxlTo+UT6lwEqQAWomMqOh3Jhpb2EQhklFKABNICGyeyDuBwG04xCGWYUAANgAIzJ7I7oAobs
//DYwAYAAMgDG9PRNtuLCRUyjDnCIAFaACVAyYU2jJpc2UwiW5MM0owAJYAAvDZRRWUfgvoehKRTWfABbA
//AlgMl0/0hIXsCYsAWAALYDFKNtGRikuSifZQ/ALo2WLQ
