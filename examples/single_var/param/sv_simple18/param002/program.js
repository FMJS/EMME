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
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG56iBli4aSuimLaSLLKVgF0LTdGFWJe9ejReMHlujY+rYfydnzngZ5UN+
//RsrtLvrcRVKKMPD8lR+pa2HdhME8P5Zysw3e3uOGh4W4FV+XYaD8tR/Zs3gGHY6uZuKo6rBVt1QltpfY
//XoetpveaVNM7Tat23LF5DT+Suip1l+vUUHca6m5D3Wu4bnY/e3H3dC8en7Fm7des8vQeWy33EttLbK/D
//9jpsr8v2utXe9B2vFsvDSz5a4fzp4plWMrtp0M4G59yg+mmQ8ssvs0+MPT8/O535sk5m7i8kEAACQGBQ
//BOwaAsUyW8MTwFwVMAAGwDDGv4NiOe1zwkCAATAAhj+GofZTcC4WFPvCgQJQAAqTyBKoNlgsuOqRJFTq
//2TkBA2AADCbkCzpYaJ0uAAtgASzMzRz0YkHAAlgAi2nmEN2o6JRCaIFCuR6oABWgYiw7HYqFJX3phAsa
//QANoMHv/w+kwdM0nwAW4ABeG74rowwWBC3ABLv7PXok2WOjIKEAFqAAVJmQUpdRSZ0LhsFyABbAAFsaf
//T2hF4bd0AlSAClBhajYxEBUEKkAFqJhQLtETilNSifZMfAMci17Y
