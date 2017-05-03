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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 < id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmztvwjAUhff+iowgIaXJJUZqxQBqUYc+JGjFGFVNh0gFOoSp6n9vXhQDjkRiOxhzNuuGHCc3/nSv
//D4nrrtbJ9zpxXSeO+uE0TPwb5/o2jgJuPNiMXXexij6/0h8/jJ2h89OJIz+ch4nXS8+mfNTtOZ2NUhYt
//dPajAy4aCKNeqrZ4j5dZ3OeU+ThVxPsVOkFFvJz31xk93zlPL/bdWR7f3k9fGA2EUV6BhAokVKB9hSK7
//0/EkT+9OzjZXnJ55nZ29kzrBwYH4YDnDpHx+Qv0qabFqoTibZ4rFOM/vx2oZDSejx9l998oFQADo1AD9
//Z0ELPnyOW4DHAzyAp0V4SCs81C48qDyAx5jW7aAsqWrc+NwDHsBjX9smjY64adMEDlo2gGNIyyYNDp0K
//HA/gAJzTgUN6wCG0agDnki1qriApM6hLTcADeGy2p49Bp545LQkO9jkA5xys6WPAoTbBQcUBOOdgS8s0
//a2KLAOAAHOst6eaNmhZo0KYBGvPt6OZNmnZoYEUDGjOt6ObQUJvtmQdoAI1RNjRpsKEJ8AAe+21oUm5D
//k579DcABOCbZ0KTchkbFATgXYEOTchsa4AAc621oUmxDo00DNNbb0KTYhiY9NjSgATTm2NCk2IZW2J5l
//0DBF/93oXi7bWZlw6bIKDSYNje47q7Pg6yxtyYztXQUTzsfk9jUH2DBFX33yz4PV+5TgdfoGdsCOCez4
//NQoOU/LRJ7gBN5dbc2Re6RSTc8Q7A+AG3Jx1vWn+RmebzHhgBswYVGtIea0hcANuLK81pLjWHMvMHw1Z
//dvo=
