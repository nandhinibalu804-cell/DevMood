const MOODS = {
      happy: {
        quote: "Every great developer you know got there by solving problems they were unqualified to solve till they did it. Keep smiling and keep building!",
        music: [
          { label: "Lo-fi Beats to Code & Chill", url: "https://www.youtube.com/watch?v=5qap5aO4i9A", icon: "🎶" },
          { label: "Happy Coding Playlist – Spotify", url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd", icon: "🎵" },
          { label: "Chilled Cow – YouTube", url: "https://www.youtube.com/@ChilledCow", icon: "🐄" }
        ],
        challenge: {
          title: "FizzBuzz with a Twist",
          desc: "Print numbers 1–30. For multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', both print 'FizzBuzz'. Add a smiley 😊 after each FizzBuzz!",
          code: `for (let i = 1; i <= 30; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz 😊");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}`
        }
      },
      focused: {
        quote: "The ability to focus attention on important things is a defining characteristic of intelligence. Zone in — great code is just ahead.",
        music: [
          { label: "Brain.fm – Focus Music", url: "https://www.brain.fm", icon: "🧠" },
          { label: "Deep Focus – Spotify", url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", icon: "🎧" },
          { label: "Neon Noir Synthwave – YouTube", url: "https://www.youtube.com/watch?v=AB5T_b1PQ0c", icon: "🌆" }
        ],
        challenge: {
          title: "Binary Search",
          desc: "Implement a binary search algorithm that finds a target number in a sorted array. Return its index, or -1 if not found.",
          code: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? left = mid + 1 : right = mid - 1;\n  }\n  return -1;\n}`
        }
      },
      tired: {
        quote: "Rest is not idleness. Even the best machines need downtime. Take it slow today — a single working line of code beats burnout.",
        music: [
          { label: "Sleepy Lofi – YouTube", url: "https://www.youtube.com/watch?v=lTRiuFIWV54", icon: "🌙" },
          { label: "Ambient Coding Sounds", url: "https://mynoise.net", icon: "🌊" },
          { label: "Calm Programming – Spotify", url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO", icon: "😌" }
        ],
        challenge: {
          title: "Simple Todo List",
          desc: "Create an array of tasks. Write a function to add a task, remove by index, and display all remaining tasks. Keep it easy today!",
          code: `const todos = [];\n\nfunction addTask(task) {\n  todos.push(task);\n}\n\nfunction removeTask(index) {\n  todos.splice(index, 1);\n}\n\nfunction showTasks() {\n  todos.forEach((t, i) => console.log(\`\${i+1}. \${t}\`));\n}`
        }
      },
      sad: {
        quote: "It's okay to not be okay. Debug your feelings the same way you debug your code — one step at a time, with patience and kindness.",
        music: [
          { label: "Peaceful Piano – Spotify", url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO", icon: "🎹" },
          { label: "Comfort Coding Beats – YouTube", url: "https://www.youtube.com/watch?v=n61ULEU7CO0", icon: "💙" },
          { label: "Rain & Coffee Sounds", url: "https://rainycafe.com", icon: "☔" }
        ],
        challenge: {
          title: "Palindrome Check",
          desc: "Write a function that checks if a word is a palindrome (reads the same forwards and backwards). Small wins build big confidence!",
          code: `function isPalindrome(word) {\n  const cleaned = word.toLowerCase().replace(/\\s/g, '');\n  const reversed = cleaned.split('').reverse().join('');\n  return cleaned === reversed;\n}\n\nconsole.log(isPalindrome("racecar")); // true\nconsole.log(isPalindrome("hello"));   // false`
        }
      }
    };

    const body = document.body;
    const moodGrid = document.getElementById('moodGrid');
    const contentArea = document.getElementById('contentArea');
    const resetBtn = document.getElementById('resetBtn');

    function applyMood(mood) {
      const data = MOODS[mood];
      if (!data) return;

      // Theme
      body.setAttribute('data-mood', mood);

      // Quote
      document.getElementById('quoteText').textContent = data.quote;

      // Music
      const musicContainer = document.getElementById('musicLinks');
      musicContainer.innerHTML = data.music.map(m =>
        `<a class="music-link" href="${m.url}" target="_blank" rel="noopener">
          <span class="icon">${m.icon}</span>${m.label}
        </a>`
      ).join('');

      // Challenge
      document.getElementById('challengeTitle').textContent = data.challenge.title;
      document.getElementById('challengeDesc').textContent = data.challenge.desc;
      document.getElementById('challengeCode').textContent = data.challenge.code;

      // Active button
      document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
      });

      // Show content
      contentArea.classList.remove('visible');
      void contentArea.offsetWidth; // force reflow for animation replay
      contentArea.classList.add('visible');
      resetBtn.classList.add('visible');

      // Persist
      localStorage.setItem('devmood_selected', mood);
    }

    function resetMood() {
      localStorage.removeItem('devmood_selected');
      body.removeAttribute('data-mood');
      contentArea.classList.remove('visible');
      resetBtn.classList.remove('visible');
      document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    }

    moodGrid.addEventListener('click', e => {
      const btn = e.target.closest('.mood-btn');
      if (btn) applyMood(btn.dataset.mood);
    });

    resetBtn.addEventListener('click', resetMood);

    // On load, restore last mood
    const saved = localStorage.getItem('devmood_selected');
    if (saved && MOODS[saved]) applyMood(saved);