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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZoMzOFiNC5sTONGTeqiS2JCFyTWuqAr03cXyiUUDkphqID/jpw5w2UgX8if
//kXK7Cz93oZQi8B1v6YXqRhi3ge9mx1Jutv76PWp4nIs78XUZ+MpbeaE5i2bQ4ehqJo6qFlu1C1Vie4nt
//tdhqcq9xNbnTpGpGHZu34COuq0J3sU41daumbtfUnZrrpvezF/fPD+LpBWvWfM1KT++w1WIvsb3E9lps
//r8X22myvXe5N3vFyvji85KMVzp4ummnEs+sGzXTQ5QbVT4OUXX6RfmLs+fnZyczXVTxzfyGBABAAAr0i
//YFYQyJfZ6J8A5qqAATAAhiH+HeTLaZ4TBgIMgAEw/DEMlZ+Cc7Gg2BcOFIACUJhElkCVwXzBVYckoVRP
//zwkYAANgGEO+oIOFxukCsAAWwGK8mYNeLAhYAAtgMc0coh0VrVIILVC4zjWoABWgYig7HfKFJX3phA0a
//QANoGPf+h9NhaJtPgAtwAS5GviuiCxcELsAFuPg/eyWaYKEjowAVoAJUjCGjKKSWOhMKi+UCLIAFsDD8
//fEIrCr+lE6ACVICKsWYTPVFBoAJUgIoJ5RIdoTgllWjOxDfAf18Y
