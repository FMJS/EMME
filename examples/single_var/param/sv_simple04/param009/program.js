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
      var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id4_R_t3 = Atomics.load(x, 0); report.push("id4_R_t3: "+id4_R_t3);
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
outputs[0] = "id4_R_t3: 0";
outputs[1] = "id4_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrT188vLSkoLdHXV8hMMYkPii8xtlIw0NfPzU9JzQEKejgp2CpUa2SmGMaHx+cmZubpANUZAdklhpo6
//CmjixiBxI0xxiLmatQqOfi4Kvv7UMxEsDtGLrhqiAt1shChULcRNQU5uYEehqIDZB9RpANKNS9IQZogb
//1GNYVEFUBIdj8ToscLj0sUWFEW2iAi3gBiKCMGwnOYLgbsKMHrgUnsiBqkGLGsxAoX/EQNTQPmIQ9iCb
//gmE79vyEJ2LgdmNGDFwKT8SgxDw8YjADBQCxkmTD
