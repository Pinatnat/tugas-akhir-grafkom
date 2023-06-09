Documentation Final Project
Nadya Aprillia / 1906398566

Pengerjaan proyek akhir ini menggunakan template dari scele
Sample Hierarchical Modelling - https://scele.cs.ui.ac.id/mod/resource/view.php?id=135108
Referensi sisanya tercantum pada source code

Struktur Data:
	1. index.html = file html untuk tampilan dan input
	
	2. folder js = berisi file serta library js yang digunakan, meliputi
		- bootstrap
		- glMatrix-0.9.5
		- jquery
		- webgll-utils
		- script (file js utama dalam pengerjaan tugas)
	
	3. folder img dan css = berisi asset untuk tampilan dan tekstur

Program dapat dijalankan dengan membuka file index.html dalam web browser.

Terdapat 5 objek di dalam proyek ini:
	1. Duck (bebek) = merupakan hierarchical model. Bagian yang bergerak diantaranya adalah
		- kaki (upper leg)
		- sayap (wings)
		- telapak kaki (feet)
		- leher (neck)
		- kepala (head)
	
	2. Snow Man (Orang salju) = object yang posisinya bisa diatur (posisi x y z)
	
	3. Dog (Anjing) = object yang posisinya bisa diatur (posisi x y z)
	
	4. Camera (sesuai dengan template) = merupakan hierarchical model. 
	Bagian yang bergerak diantaranya adalah:
		- camera shutter
		- camera tripod
		- zooming transition
		- lens
	
	5. Robot arm (sesuai dengan template) = merupakan hierarchical model. 
	Bagian yang bergerak diantaranya:
		- Arm
		- Finger

Object tersebut masing-masing memiliki animasi, baik translasi maupun rotasi.
Hal ini termasuk pada hierachical model juga.

Ketika toogle animasi dimatikan, object hierachical model dapat dengan bebas digerakan untuk setiap bagiannya.
Selain itu pada proyek akhir ini terdapat lighting, ambient, tekstur, dan fokus kamera.

	- Ambient berupa input RGB yang dapat dimasukkan untuk menambahkan warna pada view (mirip filter tampilan).

	- Lighting pada proyek ini berupa sumber cahaya yang dapat digerakaan serta ada juga mengubah warna cahaya berdasarkan input RGB.

	- Masing-masing object termasuk ruangan bisa di-apply tekstur. 
	Tekstur yang ada dalam proyek ini adalah:
		- Brass
		- Chrome
		- Gold
		- Bronze
		- Forest (terfokus warna hijau)
		- Copper (mirip bronze tetapi lebih tidak berkilau)

	- Terdapat beberapa fokus camera diantaranya:
		1. Free mode (bebas)
		2. Default
		3. Duck
		4. Camera
