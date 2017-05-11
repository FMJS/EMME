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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznEMtHTRUEI3bSFdZCkFuxCapguzKnn3arxg9NiacYwK/07OnPEyyof8
//jJS7ffS9j6QUYeD5az9St2J+FwaL/FjK7S74+IwbnpbiXvxch4HyN37kzOIZdDy6mYmTqstWdalKbC+x
//vS5bTe81qaZ3mladuGP7Hn4ldVXqLtepoe421HVD3Wu4bnY/B/Hw8iieX7Fm7des8vQeWy33EttLbK/L
//9rpsr2Z7dbU3fcfr5er4kk9WOH+6eOY8md006GSDC25Q/TVI+eVX2SfGnp+fnc582yQzD1eSQ4CAABAA
//ArYQcGoIFMs8758A5qrGMGhHgQbQABr6+z8oltO5JA1kgQYNGkADaOhEQ+3H4FIwKPaFd2cBeQJQAAoj
//yBOoNlgsuOqQJlTq2TmRMQAGwDCFjMEGC60TBmMskDuAC3AxgtzBLhfUGxfIIsAFuBg4izDDwiiJMKYC
//+QSgABSj3O9QLCzZyyc08gnAABimvAfifBZM8wmNfAJcgItp74vowgX1xgXyCXABLka3V6INFjbyCY18
//AlAAitHnE6W80mY64bJYIJsACkBh7NmEVRL+Sya6QoFcAlSAiqFyiZ6ooJ6oQCYBKkDFEJlERyjOSSTa
//M/ELYsteyA==
