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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[5] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[7] = "id6_R_t3: 65792;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tOwkAUgOG9T9GlJiSlnaFEjQuJIW7UBBcsiUldNFFxUVbGd7fQAi1My6Wd6cV/R87MnLYMfDnJ
//9Nj2fBF+L0LbtgLfm01mobix+reBP1x/tu3Puf/+EU14HFl31s9l4Luz6Sx0etEKsfp01bMyUZmKCmU0
//vtIyGl8njjrRjM+34GsZd1Oz03GRE5c58cEy7u7HvZzrJvfza90/P1hPL//niXeeKJ1lG/WUc9MZhDKD
//UGYQygxSmUEqM0hlhnjd7txtNLPHk9F4tcmZPVp/P9HK/nJ13qBTNOgWDYpkcFi0cqhemdz4OPlxKvOr
//V8crX6fJylP+EBc2VEAFVBRQUV6D7eBmi/v6oVBc9WQ+YAImYKJ8RXEiE5utdEwyIWACJmBCLxNlC4a6
//kXCVP0JddLgDDzzAAzyqrzFkLXxIoAAKoGhPlSEbVGXowsMbDAR8wAd8lD4d2bdl80CuSUDSXyNUQAVU
//1HE6clKlUQ8U6koDPuADPuquNI44GKmbDwEf8AEfdfFR7sCkmbWHaVKG1y6kQAqknFWRyKahIuEDPuCj
//FRWJbEdFYpaU9OtiDpzACdWI2T6V/cEURud3qezEk5yHe1dgAiZgomk9KlUgcXSHymE6QAIkQKJpHSrV
//IiFAAiRAolv9KfrqCP1wZF86hw7ooL4w2p1SLR4SJmACJrrWm2KiwtBFx+4LX+ABHtQYRjtTquXjwKEp
//UAAFULSxL8VElQEe4AEeHexK0XdOAh7gAR4d7kkxfX5iApTsK+WAAihUIwY7UvSdqoAHeIBHh/tRTJ+1
//VAnKH+qKprg=
