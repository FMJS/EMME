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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhs3Nk10NJDQwm9tIX0kKMUzEFomh7MqeS/V+MHRsfWjzVaeG9hnI1mDQ/D
//q1LuD+HXIZRSBL7rrb1Q3Yr5XeAvss9S7vb+9iNqeFqKe/F9HfjK23ihM4tW0OnTzUycVTVbNYUqsb3E
//9mq2mlxrXE2uNKk6UcfuPfiM66rQXaxTTV3X1E1N3a05b3o9R/Hw8iieX7Fnzfes9OtdtlrsJbaX2F7N
//9mq217C9ptyb3OP1cnW6yWc7nP26aOU8Xl130EkPLriD6reDlJ1+lf7F2O/nVycr3zbxyuOV5BAgIAAE
//gIAtBJwKAvk2z4cngDlrZxgwHQAGwDDgdJBvp3NJGKg3DJgYAANg6AdDZSi4FAuKveFkdVogoAAUgMI4
//WQJVDuYbrnokCaV6+p0tpwXAABgAwyj5gg0WGqcLnbHAFAEsgMXomYNdLGggLDBZAAtgMXIO0Y2KTimE
//lakCgSWgABSTec8h31iyl02YThMEYAAMgGEi7z60Z6FrNmEwRQALYPGf34fogwUNhAUmC2ABLCb3jkQT
//KmxkEwZPPAAFoJh8NlHIKm0mE5rFwuDJBlAAChPPJayS8Fcq0RcKTA+AAlCMk0kMBAUNAgUmCkABKMbI
//I3oy0SaNaI7ED3P0W6A=
