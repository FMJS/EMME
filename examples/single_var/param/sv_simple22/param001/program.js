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
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGwgxNlPY2GFllF22QXfoUQb2IKzrDvY0+t2n8y1NIr6l2oz/TR6Txxjlh/yR
//0v0h+T4klJI48sJ1mLA74t7H0W127KXHlO720fYzHfC8JA/k57oc56QzFuEmPbpxyEmVC9V8hFzNu2dV
//P6t6cjUQqvkIucrS491H/OVU61br4urEOm+o59dX637DdYv1HMnj6xN5ecPu6HZHunuxS131tWPFDvVO
//iR3qqq8dK3bg2g5c24HLHfJnvF6u/h7yySrLe05nutnsppOsOFk/R81M7UlWXn6lvGLCKP3sfOb7ppjZ
//5cUotud4RYEDcAAOhnBgCg5VU/f8NOi3sx8YgAEwAIYJvhqqBbApYQgAA2AADDPDoHwUTMVC+6YBBaAA
//FKzNGNST1eNxRyQMUr3o2Z47AAbAABjmzxdMsNA5XWjHAiyABbAwf7pgloUALIAFsGB7tjAMhUHJAkgA
//CSDB1r8XqsfAzCULHMkCYAAMNv+50J+FockCx/cCWAALdvy3MIaFACyABbDw//5a6IKCiWQBJIAEkHBJ
//yYKQKZrMFRbaVwmpAlAACpeeKhgloS1T6AwFSAAJIGGmROFMJAQgASSABAvThJEg9MkSunPwC4K6LNA=
