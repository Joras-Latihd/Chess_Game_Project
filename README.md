## ♟<u> **Online Chess Game**</u>
An interactive browser-based chess game built by **Saroj Dhital** using HTML, CSS, and JavaScript. 
This project offers a visually polished wooden chessboard with a full rules engine, a computer opponent with three difficulty levels, a 2-player mode, and a user-friendly design that works on both desktop and mobile.
***
## 🛠️ <u>**Technologies Used:**</u>
● **Frontend**: HTML5, CSS3 (Grid & Flexbox for layout, responsive design, dark wooden theme with brass and green accents)

● **Typography**: Playfair Display and Manrope (Google Fonts)

● **Logic**: JavaScript (chess rules, legal move generation, check and checkmate detection, computer opponent, and gameplay flow)
***
## ✨ <u>**Features:**</u>
✅ Full chessboard with all standard pieces and setup

✅ Play **against the computer** (Easy, Medium, Hard) or **with a friend** in 2-player mode

✅ Handles legal moves for every piece (pawns, rooks, bishops, knights, queen, king)

✅ Special moves: **castling**, **en passant**, and **pawn promotion** (automatically becomes a queen)

✅ Turn-based gameplay (White vs. Black), and you can never leave your own king in check

✅ Full **check, checkmate, and stalemate** detection

✅ Draw detection for the **50-move rule** and **not enough material**

✅ Tap or click a piece to see its legal moves (dots for moves, rings for captures)

✅ Last move highlighted, and the king glows red when in check

✅ **Move history** list, **Undo** button, and **Flip board** button

✅ Captured pieces shown next to each player, and the active player is highlighted

✅ Responsive design for desktop, tablet, and mobile

✅ Clear, readable UI with a wooden board, coordinate labels, and no popup alerts
***
## 🚀 <u>**How It Works:**</u>
1. Open the game in the browser and choose **vs Computer** or **2 Players**.
2. White moves first, then players alternate turns.
3. Tap a piece to highlight its legal moves, then tap a highlighted square to move.
4. Pieces follow standard chess movement rules, including castling and en passant.
5. The game ends with checkmate, stalemate, or a draw, and the status panel shows the result.
6. Use **Undo** to take back a move, **Flip board** to change sides, or **New game** to restart.
***
## 🗂️ <u>**Project Structure:**</u>
```
Chess_Game_Project/
├── index.html          → Page structure
├── chess.js            → Rules engine, computer player, and game logic
└── css/
    ├── base.css        → Theme, page layout, and title
    ├── board.css       → Board, pieces, and highlights
    ├── players.css     → Player bars and captured pieces
    ├── panel.css       → Side panel, status, and buttons
    ├── moves.css       → Move history list
    └── responsive.css  → Phone styles and reduced motion
```
***
## 🔧 <u>**What Changed in the Upgrade:**</u>
● ♟ Replaced the basic move checks with a complete rules engine (check, checkmate, stalemate, castling, en passant, promotion, and draw rules)

● 🛡️ Fixed old problems: capturing your own pieces, moving into check, and the game only ending when a king was captured

● 🤖 Added a computer opponent with three difficulty levels

● 📱 Made the board fully responsive with tap-to-move support

● 🎨 Redesigned the look with a dark wooden theme, serif title, and flat buttons

● 🗂️ Split the styles into separate files and removed popup alerts in favor of an on-screen status
***
## 📷 <u>**Screenshots:**</u>
**Normal State:**
![alt text](https://github.com/Joras-Latihd/Chess_Game_Project/blob/3333a0f126b1ecc26682f0a8da91bbec21966901/Updated%20Normal%20State.png)
**During Gameplay:**
![alt text](https://github.com/Joras-Latihd/Chess_Game_Project/blob/3333a0f126b1ecc26682f0a8da91bbec21966901/Updated%20During%20Gameplay.png)
***
## 💡 <u>**Future Enhancements (Ideas):**</u>
● Choose the promotion piece instead of an automatic queen

● Drag-and-drop piece movement

● Chess clock and timer

● Draw by threefold repetition

● Online multiplayer
***
## 👨‍💻 <u>**Author**</u>
**Saroj Dhital** Computer Science Student & Web Developer
***
## 🌟 <u>**Show Your Support**</u>
If you like this project:

⭐ Star this repo

🔗 Share with your friends
