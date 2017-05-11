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
      if(id4_R_t2 >= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmktvgkAUhff9FSw1MUG4MiZtXGha00UfibZxSZrSBUnVLnDV9L+XZwU6NDxmcJye3eTqHODCl3M5
//wTT3h+DjEJim4XsTd+UG9qUxvvI9J11b4Xqa1U1zu/fe3sM/3y6MmfE58D3b3biBNQp3U7wajoxBphRV
//E51ydZqrOtyqFaptX/xdVLdzyvk6VdQnFTpORT097pcxf7g27h/1u7K4fryeCbfqcKt5BeIqEFeBygpJ
//d1eLZdzeQs+yMw53jqPdhdb9tCL7acrfl+ov07vHVecL8zUTvfUm0kvWcW9f9ztvtpzfrW+GFybgATyn
//hscu8yEQnXyHAQ7AgesUgRPkOakiwAE4+jpOHWya+I0kaCxAA2gUchsS7jYEcACO7m5Dgt1GIDTRmgka
//0WQ/LsejMu6jyyo0WGdoZF9Zkwe+yaPdsWOls2Dc47FubsP5kQnK1Ip11iwceFo9gx/wowI/f5iOAHr4
//xiOLHQvsgJ0e2SGp7FCv7MB3wI4yc9svUxI1teXvE9gBO9rNbJ3J4U9scrjBvAZuFJnXOnNDJ+LGAjfg
//5nTckBxuCHMauPnH2XSXL2+qEoIanxGAHbBz5rl0+49v5HCDdxxwcw6ZdB1uqEdu4Dfg5hzy6C6TGj8d
//ADfgRvcsuv2UJoMZzGhgRv0cuv2EJpsZZNBgRs0Muj0z1ONsZoEZMKNU/kwS8mcCO2BH+/yZhOfPJOXd
//BtyAG5XyZxKeP8NvwI3++TMJz5/BDbjRPX8mwfkzZjQwo3v+TILzZ5KSP4MZMKNO/kyC8+e6zHwDT39z
//0A==
