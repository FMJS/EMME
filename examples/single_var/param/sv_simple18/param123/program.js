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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 770;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 513";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 513";
outputs[15] = "id6_R_t2: 770;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1LwzAYB/C7nyJHhUGWpGlE8eCQ4UWFefBYhHooOOehO8m+u+3alax7ql2avhz+t/HkSV/S8aP9
//E8432/R7m3LOkjiMVlEqb9j8NonN4Tfn60388Zk1PC7YHfu5TGIZvUWpmGUz1P7X1YwdVQOyqq2qInsV
//2RuQ1eJa82pxpUVVZB3r9+Qrr0ur266rhnrQUNcN9bDhvOX17Nj98wN7esGatV+z2t2HZNXuVWSvInsD
//sjcgezXZq+u9xTNeLZb7h3y0woe7y2bO89lNg6IcNNSg/GtQHU6/LP9i5PHp2cXM17d85u6CUwhIIAAE
//gIAvBMQJAtUyz/sngDirMwwmvAYNoAE09Pd+UC2nGJIG1Z0Gg08H0AAautFw8mIwFAySfODdWbBREEAB
//KACFcfIEdTJYLbjskCbU6uUxz8wYAANgAAyjZAw+WGidMDhjcZw7gAtwAS5GyR38cqH64sLgswNcgIuR
//swg3LJySCGcqbCi0kKACVICKqex4qBZW+UsotFNCARpAA2iYzD6I82FwzSi0Y0YBMAAGwJjM7oguYKi+
//wDD4+AAYAGOCeybacOEjp9COOYUCFaACVAyYU1jJpc+UIiC5cM0owAJYAAvDZRReUfgvoehKRT2fABbA
//AlgMl0/0hIXqBwuDDw5gASzGySY6UnFOMtEeil9Sb2JM
