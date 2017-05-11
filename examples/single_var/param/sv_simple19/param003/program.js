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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[9] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[11] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[12] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[13] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[14] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[15] = "id8_R_t3: 131586;id9_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3U1vHLkRgOF7foWOMbCAPno0YyXIIYtgkUsSYHPYoxHAORjIZnPwnoL89/hDqx15qO4hhyzS3c9N
//aGk8QlnzvixWkXV9/dPP7//z8/vr66t3b1+/+f7N++l3Vze/f/f24Zevr69//OntP//14Qf+/O3VH67+
//+9t3b+/e/PDm/e03H14xffrq1TdXz57ujp5Oyaf3H7+++/h0/+mrL58ejp7uk08//64fn37+TT8/vf3w
//Ez/+492/Pz6/O3q/4+fTC893Lzy/P3rX4+f7F54fXnj++oXf8/H3/9/VH//6p6u//E2M28X4ixgev+uv
//T/fJp4fk09fJf/f43abku03Jd5uS7zYl321Kvtsu+W675Lvtku+2S77bLvluv/4tvU4+Pf7ZffJn98mf
//PSR/9vDlz37+xHz/7XefPjLP/l5/+b//8Mqbj69+6Zu3c9+8m/vm9PjNh7lXPqRf+fiLf/f4UU/+++lX
//f37l3394fGUOXn5znUL9HdRDPdRD/RpQfznNf/3m05/7TXvQJ941G//zmL+/BXqgB3qgX/+aPhP0T3/W
//t5Ggn5qBfgf0QA/0QL8G0F+6aO+N+eOPWHv43063NwcLffzHf/zf+Ob9qRye/nzvIg2wa8l6a32sx3qs
//X//ufdZavw/p02v9hvy/f43/+I//+L/+tf4Z+/a9+T/F83+P//iP//i/Bv5ftp0/5uo/1gn69umADuhA
//j88X33wKamjx9/i/sibmVXhhHuZhXofPAJBPr/tboV+HD/7jP/5vdtf/ZHOnN/938fxX9cV//Mf/7e36
//D0f/5Z6f9k6w608HdEAHGv6/+OZT+EILwXu7/jAvxjAP8xG9/n0gn173t0K/23vAH/zBX6P/EPCfguFv
//vx/8wR/8dfkPuu6PFYL9fjqgAzrYYi5wUuXtLYT75AdSDQD6xRj6ob9WJjAc+Jf7/mUCdCDGdEAH4XO6
//ngI1RSrhYNUP82IM8zBfbUbXTErQB/Lpdf9B5w/4izH4g3/FO31myr994D8Fw1/nD/iDP/iv9Kafss6f
//kdb9sUJw+w8ncAInbHbTf+b+hz5W2MXzX06A//iP/yutBpTd/jNSThDuBHPAOIETOGG1OUHOsJcxSwQd
//nGA2GCdwAid8vU6oNP4rygilE8Da+8A5ASqgAirYYg/RzMGxPglC+oiYswPQL8bQD/21OoiGA3/OiWEd
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
