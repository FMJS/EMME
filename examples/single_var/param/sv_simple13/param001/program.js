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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm01Pg0AQhu/+Co6aNKGwhSYaDzam8aIm9dAjMcEDibUe6Mn0v8tXYW2Xfthlgea5bWZ3ho/lfZgw
//jG0vV/H3KrZtKwr9YBbE4tYa3kXheDO27cUy/PhMFjxNrHvr5zoK3WAexM4g8RDZ6GZgJdZROnZTq5eN
//cmseM7XmEXOrk6xYvEdfqd2VYsh2UWMfSdFlu1dj92uOW5zP2np4ebSeXy/x2jJ7dUVy9MrqKa2+MoIc
//VyjjCmVcoYwrlHGre+0rrfJaT7nW216b7/FsMs02+c/Obe5a4jlMvesmnX2T7r5JUUyO93mO1Z7FiU+L
//h1MZX+2de77NU8/1lY3MkTky16TkarLc+GHzIlccFekjfaSv6Q1/ovTLDXZMSl8gfaSP9E+X/rkv9raF
//Lz9s4AAcgIPOZALlLTEKBHkjkD7SR/rGM4F2hK/OBMABOAAHRr/677KivHjXJBA8pI/0kb7mSsBJmUA7
//wldnAuAAHIAD3ZnAEQWAtnEgwAE4AAe6cHBeUaCbuQGIABEgoq2MYed7YduQGCkfTXAADsBB0xlD52Bw
//uK4AIkAEiOhdj8HupASY/3cYbNmLmEgf6SP9bvQd6BD+0V0H4AAcgIMu9yLoxYEAB+AAHPS1P6G53ABE
//gAgQcRE9C3ohceAXZXAADsBBd/sYTGQMIAJEgIge9zbohYQHDsABOOhrv4OJjAFEgAgQ0dseiOZqEiAC
//RICI3vdFmK5TgA2wATYuoFeiudoFiAARIKL3/ROm6xk6sfELeJqf4w==
